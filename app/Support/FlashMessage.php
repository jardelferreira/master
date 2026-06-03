<?php

namespace App\Support;

trait FlashMessage
{
    protected function success(string $message, string $type = 'toast')
    {
        return back()->with('feedback', $this->build('success', $message, $type));
    }

    protected function error(string $message, string $type = 'toast')
    {
        return back()->with('feedback', $this->build('error', $message, $type));
    }

    protected function info(string $message, string $type = 'toast')
    {
        return back()->with('feedback', $this->build('info', $message, $type));
    }

    protected function warning(string $message, string $type = 'toast')
    {
        return back()->with('feedback', $this->build('warning', $message, $type));
    }

    protected function successRedirect(string $message, string $route, array | string $params = [])
    {
        return redirect()
            ->route($route, $params)
            ->with('feedback', $this->build('success', $message, 'toast'));
    }

    private function build(string $status, string $message, string $type): array
    {
        return [
            'status' => $status,
            'message' => $message,
            'type' => $type,
            'id' => uniqid(),
        ];
    }
}
