<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListUsersRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Gestión de usuarios desde el panel admin. Todas las rutas pasan por auth:sanctum + role:admin.
 * Solo se gestionan estudiantes y empresas: las cuentas admin no aparecen ni se pueden modificar.
 */
class UserController extends Controller
{
    /** Roles que el admin puede ver y gestionar. */
    private const MANAGEABLE_ROLES = [UserRole::STUDENT, UserRole::COMPANY];

    /** GET /api/admin/users — lista paginada con búsqueda y filtros. */
    public function index(ListUsersRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $users = $this->manageableUsers()
            ->with(['role', 'studentProfile.university', 'studentProfile.career', 'companyMember.company'])
            ->when($filters['role'] ?? null, fn (Builder $q, string $role) => $q->whereHas('role', fn (Builder $r) => $r->where('name', $role)))
            ->when($filters['status'] ?? null, fn (Builder $q, string $status) => $q->where('is_active', $status === 'active'))
            ->when(trim($filters['search'] ?? ''), fn (Builder $q, string $search) => $this->applySearch($q, $search))
            ->latest()
            ->orderByDesc('id')
            ->paginate($filters['per_page'] ?? 15);

        return AdminUserResource::collection($users);
    }

    /** PATCH /api/admin/users/{user}/status — activa o suspende una cuenta. */
    public function updateStatus(UpdateUserStatusRequest $request, User $user): AdminUserResource|JsonResponse
    {
        if (! in_array($user->role->name, self::MANAGEABLE_ROLES, true)) {
            return response()->json(['message' => 'Las cuentas de administrador no se pueden modificar desde aquí.'], 403);
        }

        $user->update(['is_active' => $request->validated('is_active')]);

        // Al suspender se cierran todas sus sesiones: el login ya rechaza cuentas inactivas,
        // pero un token emitido antes seguiría funcionando si no se borra.
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return new AdminUserResource($user->load(['role', 'studentProfile.university', 'studentProfile.career', 'companyMember.company']));
    }

    /** GET /api/admin/summary — totales para las tarjetas del panel y los últimos registros. */
    public function summary(): JsonResponse
    {
        $byRole = fn (string $role) => User::whereHas('role', fn (Builder $r) => $r->where('name', $role));

        $recent = $this->manageableUsers()
            ->with(['role', 'studentProfile.university', 'studentProfile.career', 'companyMember.company'])
            ->latest()
            ->orderByDesc('id')
            ->limit(5)
            ->get();

        return response()->json([
            'users' => $this->manageableUsers()->count(),
            'students' => $byRole(UserRole::STUDENT)->count(),
            'active_students' => $byRole(UserRole::STUDENT)->where('is_active', true)->count(),
            'universities' => StudentProfile::distinct()->count('university_id'),
            'companies' => $byRole(UserRole::COMPANY)->count(),
            'suspended' => $this->manageableUsers()->where('is_active', false)->count(),
            'recent' => AdminUserResource::collection($recent),
        ]);
    }

    private function manageableUsers(): Builder
    {
        return User::query()->whereHas('role', fn (Builder $r) => $r->whereIn('name', self::MANAGEABLE_ROLES));
    }

    /** Busca en nombres, apellidos, correo y nombre de la empresa, sin distinguir mayúsculas. */
    private function applySearch(Builder $query, string $search): Builder
    {
        $term = '%'.mb_strtolower($search).'%';

        return $query->where(function (Builder $q) use ($term) {
            foreach (['first_name', 'second_name', 'first_surname', 'second_surname', 'email'] as $column) {
                $q->orWhereRaw("LOWER({$column}) LIKE ?", [$term]);
            }
            $q->orWhereHas('companyMember.company', fn (Builder $c) => $c->whereRaw('LOWER(name) LIKE ?', [$term]));
        });
    }
}
