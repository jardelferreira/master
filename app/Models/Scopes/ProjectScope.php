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
         if (! Auth::check()) {
            return;
        }

        $user = Auth::user();
        if($user->hasRole('super.admin')) return;
        
        $builder->whereHas('users', function (Builder $query) use ($user) {
            $query->where('users.id', $user->id);
        });
    }
}
