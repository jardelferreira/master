<?php

namespace App\Services;

class ServiceResult
{
    public function __construct(
        public bool $success,
        public ?string $message = null,
        public mixed $data = null
    ) {}

    public static function ok(mixed $data = null): self
    {
        return new self(true, null, $data);
    }

    public static function fail(string $message): self
    {
        return new self(false, $message);
    }
}