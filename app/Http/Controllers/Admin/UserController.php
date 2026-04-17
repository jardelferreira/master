<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Mail\UserInvitationMail;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/users/Index', [
            'users' => User::select('id', 'name', 'email', 'created_at', 'active')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/users/Create', [
            'emailVerificationEnabled' => env('FORTIFY_EMAIL_VERIFICATION', false),
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $user = User::create($request->all());
        if (!$user) {
            return back()->with('feedback', [
                'success' => false,
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar o usuário. Por favor, tente novamente.',
                'type' => 'toast',
            ]);
        }

        if (env('FORTIFY_EMAIL_VERIFICATION', false)) {
            $user->sendEmailVerificationNotification();
        }
        return back()->with('feedback', [
            'success' => true,
            'status' => 'success',
            'message' => 'Usuário criado com sucesso.',
            'type' => 'toast',
        ]);
    }

    public function Invite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $availability = $this->availableForInvite($request->email);

        if (isset($availability['available']) && !$availability['available']) {
            return back()->with('feedback', [
                'success' => false,
                'status' => 'error',
                'message' => $availability['message'],
                'type' => 'toast',
            ]);
        }

        $invitation = UserInvitation::create([
            'email' => $request->email,
            'expires_at' => now()->addDays(7),
            'invited_by' => Auth::id(),
        ]);

        try {
            Mail::to($invitation->email)->send(new UserInvitationMail($invitation));
            return back()->with('feedback', [
                'success' => true,
                'status' => 'success',
                'message' => 'Convite enviado com sucesso.',
                'type' => 'toast',
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao enviar convite de usuário', [
                'email' => $invitation->email,
                'invitation_id' => $invitation->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('feedback', [
                'success' => false,
                'status' => 'error',
                'message' => $e->getMessage(),
                'type' => 'toast',
            ]);
        }
    }

    public function availableForInvite($email)
    {
        if (User::where('email', $email)->exists()) {
            return [
                'available' => false,
                'message' => 'O email já está em uso por outro usuário.',
            ];
        }
        if (UserInvitation::where('email', $email)->whereNull('accepted_at')->where('expires_at', '>', now())->exists()) {
            return [
                'available' => false,
                'message' => 'Já existe um convite pendente para este email.',
            ];
        }
    }

    public function showInvite(UserInvitation $invitation)
    {
        if (!$invitation->isValid()) {
            return Inertia::render('invitations/InviteExpired');
        }
        return Inertia::render('invitations/AcceptInvitation', [
            'invitation' => $invitation,
        ]);
    }

    public function acceptInvite(UserInvitation $invitation, UserStoreRequest $request)
    {
        if (!$invitation->isValid()) {
            return Inertia::render('invitations/InviteExpired');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $invitation->email,
            'password' => $request->password,
            'active' => true,
            'uuid' => $request->uuid,
        ]);

        if (!$user) {
            return back()->with('feedback', [
                'success' => false,
                'status' => 'error',
                'message' => 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
                'type' => 'toast',
            ]);
        }

        $user->email_verified_at = now();
        $user->save();

        $invitation->accepted_at = now();
        $invitation->save();

        Auth::logout(); // encerra sessão atual

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Auth::login($user); // login do convidado

        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function toggleStatus(User $user)
    {
        if (!$user->exists()) {
            return back()->with('feedback', [
                'success' => false,
                'status' => 'error',
                'message' => 'Não foi possível alterar o status, usuário não encontrado',
                'type' => 'toast',
            ]);
        }
        $user->active = !$user->active;
        $user->update();

        return back()->with('feedback', [
            'success' => true,
            'status' => 'success',
            'message' => 'Status alterado com sucesso!',
            'type' => 'toast',
        ]);
    }

    public function destroy(User $user)
    {
        if (!$user->exists()) {
            return back()->with('feedback', [
                'success' => false,
                'status' => 'error',
                'message' => 'Usuário não encontrado',
                'type' => 'toast',
            ]);
        }

        $user->delete();
        
        return back()->with('feedback', [
            'success' => true,
            'status' => 'success',
            'message' => 'Usuário excluído com sucesso!',
            'type' => 'toast',
        ]);
    }
}
