<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class ProjectScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // ── Guard web (usuário admin do sistema) ──────────────────────────────

        if (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();

            // Super admin vê tudo
            if ($user->hasRole('super.admin')) {
                return;
            }

            // Usuário normal: apenas projetos vinculados
            $builder->whereHas('users', function (Builder $query) use ($user) {
                $query->where('users.id', $user->id);
            });

            return;
        }

        // ── Guard stock ───────────────────────────────────────────────────────

        if (Auth::guard('stock')->check()) {
            $user = Auth::guard('stock')->user();

            // Super admin vê tudo
            if ($user->hasRole('super.admin')) {
                return;
            }
            // StockUser tem pivot próprio com projects
            // Ajuste 'stock_user_project' e as FKs conforme sua migration
            $builder->whereHas('users', function (Builder $query) use ($user) {
                $query->where('users.id', $user->id);
            });

            return;
        }

        // ── Guard consulta ────────────────────────────────────────────────────

        if (Auth::guard('warehouse')->check()) {
            $user = Auth::guard('warehouse')->user();

            // Super admin vê tudo
            if ($user->hasRole('super.admin')) {
                return;
            }
            $builder->whereHas('users', function (Builder $query) use ($user) {
                $query->where('users.id', $user->id);
            });

            return;
        }

        // ── Nenhum guard autenticado: retorna vazio por segurança ─────────────

        $builder->whereRaw('1 = 0');
    }
}
