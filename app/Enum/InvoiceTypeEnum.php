<?php

namespace App\Enum;

enum InvoiceTypeEnum: string
{
    case NF = 'nf';
    case NFS = 'nfs';
    case FAT = 'fatura';
    case REC = 'recibo';
    case CF = 'cupom';

    public function label():string
    {
        return match ($this){
        self::NF => 'Nota Fiscal',
        self::CF => 'Cupom Fiscal',
        self::FAT => 'Fatura',
        self::REC => 'Recibo de pagamento',
        self::NFS => 'Nota Fiscal de Serviço',
        };
    }
}
