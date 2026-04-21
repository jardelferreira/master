<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

#[Fillable(['email', 'expires_at', 'invited_by'])]

class UserInvitation extends Model
{
    /** @use HasFactory<\Database\Factories\UserInvitationFactory> */
    use HasFactory;

    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($invitation) {
            $invitation->uuid = Str::uuid();
        });
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function isValid(): bool
    {
        return is_null($this->accepted_at)
            && $this->expires_at->isFuture();
    }


    public function getStatusAttribute(): string
    {
        if ($this->accepted_at) {
            return 'accepted';
        }

        if ($this->expires_at->isPast()) {
            return 'expired';
        }

        return 'pending';
    }

    public function getRoutekeyName()
    {
        return "uuid";
    }
}
