<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserInvitationRequest;
use App\Http\Requests\UpdateUserInvitationRequest;
use App\Models\UserInvitation;
use Inertia\Inertia;

class UserInvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Users/InvitationsModal', [
            'invitations' => UserInvitation::with('inviter:id,name')
                ->latest()
                ->get()
                ->map(fn($inv) => [
                    'id' => $inv->id,
                    'email' => $inv->email,
                    'status' => $inv->status,
                    'expires_at' => $inv->expires_at->diffForHumans(),
                    'accepted_at' => $inv->accepted_at,
                    'invited_by' => $inv->inviter?->name,
                    'link' => route('invitations.accept', $inv->uuid),
                ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserInvitationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserInvitation $userInvitation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserInvitation $userInvitation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserInvitationRequest $request, UserInvitation $userInvitation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserInvitation $userInvitation)
    {
        //
    }

    public function getInvitations()
    {
        return UserInvitation::with('inviter:id,name')
            ->latest()
            ->get()
            ->map(fn($inv) => [
                'id' => $inv->id,
                'email' => $inv->email,
                'status' => $inv->status,
                'expires_at' => $inv->expires_at->diffForHumans(),
                'invited_by' => $inv->inviter?->name,
                'accepted_at' => $inv->accepted_at
                    ? $inv->accepted_at->diffForHumans()
                    : null,
                'link' => route('invitations.show', $inv->uuid),
            ]);
    }
}
