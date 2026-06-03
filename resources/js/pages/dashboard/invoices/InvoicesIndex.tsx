import { Head, usePage, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { DataTable } from '@/pages/components/DataTable';
import { PageCard } from '@/pages/components/PageCard';
import { PageContainer } from '@/pages/components/PageContainer';
import { usePermission } from '@/hooks/usePermission';

import { Eye, CheckCircle, DollarSign, XCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatValues';

type Status = {
  color: string;
  value: string;
  label: string;
}

type Invoice = {
  id: number;
  number: string;
  series: string;
  status: Status;

  total: number;

  provider: {
    trade_name: string;
  };

  project: {
    name: string;
  };

  sector: {
    name: string;
  };

  created_at: string;
};

type PageProps = {
  invoices: Invoice[];
};

export default function InvoicesIndex() {
  const { invoices } = usePage<PageProps>().props;
  const { can } = usePermission();

  /*
  |--------------------------------------------------------------------------
  | AÇÕES
  |--------------------------------------------------------------------------
  */

  function handlePay(invoiceId: number) {
    router.post(route('admin.invoices.pay', invoiceId), {}, {
      preserveScroll: true,
    });
  }

  function handleComplete(invoiceId: number) {
    router.post(route('admin.invoices.complete', invoiceId), {}, {
      preserveScroll: true,
    });
  }

  function handleCancel(invoiceId: number) {
    router.post(route('admin.invoices.cancel', invoiceId), {}, {
      preserveScroll: true,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | COLUNAS
  |--------------------------------------------------------------------------
  */

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: '#',
      meta: {
        className: 'w-16',
      },
    },
    {
      accessorKey: 'number',
      header: 'Nota',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="font-medium">
            {invoice.number}/{invoice.series}
          </div>
        );
      },
    },
    {
      accessorKey: 'provider',
      header: 'Fornecedor',
      cell: ({ row }) => row.original.provider?.trade_name,
    },
    {
      accessorKey: 'project',
      header: 'Projeto',
      cell: ({ row }) => row.original.project?.name,
    },
    {
      accessorKey: 'sector',
      header: 'Setor',
      cell: ({ row }) => row.original.sector?.name,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue<Status>();

        const colors: Record<string, string> = {
          issued: 'bg-slate-100 text-slate-600',
          pay: 'bg-blue-100 text-blue-600',
          completed: 'bg-green-100 text-green-600',
          cancelled: 'bg-red-100 text-red-600',
          returned: 'bg-amber-100 text-amber-600',
        };

        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      cell: ({ getValue }) =>
        new Date(getValue<any>()).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      header: 'Ações',
      meta: {
        className: 'w-32 text-right',
      },
      cell: ({ row }) => {
        const invoice = row.original;

        return (
          <div className="flex justify-end gap-2">

            {/* VISUALIZAR */}
            <button
              onClick={() => router.visit(route('admin.invoices.show', invoice.id))}
              className="p-2 rounded-md hover:bg-slate-100"
              title="Visualizar"
            >
              <Eye className="h-5 w-5 text-blue-600" />
            </button>

            {/* PAGAR */}
            {invoice.status.value === 'issued' && (
              <button
                onClick={() => handlePay(invoice.id)}
                className="p-2 rounded-md hover:bg-blue-50"
                title="Marcar como paga"
              >
                <DollarSign className="h-5 w-5 text-blue-600" />
              </button>
            )}

            {/* COMPLETAR */}
            {invoice.status.value === 'pay' && (
              <button
                onClick={() => handleComplete(invoice.id)}
                className="p-2 rounded-md hover:bg-green-50"
                title="Liberar estoque"
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
              </button>
            )}

            {/* CANCELAR */}
            {invoice.status.value !== 'cancelled' && (
              <button
                onClick={() => handleCancel(invoice.id)}
                className="p-2 rounded-md hover:bg-red-50"
                title="Cancelar"
              >
                <XCircle className="h-5 w-5 text-red-600" />
              </button>
            )}

          </div>
        );
      },
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <Head title="Notas Fiscais" />

      <PageContainer>
        <PageCard>
          <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow backdrop-blur">

            <DataTable<Invoice>
              data={invoices}
              columns={columns}
              searchPlaceholder="Buscar por número ou fornecedor..."
              headerActions={[
                {
                  permissions: ['invoices.create'],
                  type: 'link',
                  href: route('admin.invoices.create'),
                  label: 'Nova Nota',
                  className:
                    'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow border-0',
                },
              ]}
            />

          </section>
        </PageCard>
      </PageContainer>
    </>
  );
}

InvoicesIndex.layout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);