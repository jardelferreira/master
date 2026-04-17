type Props = {
    code: string;
    title: string;
    description: string;
    children?: React.ReactNode;
};

export function ErrorCard({ code, title, description, children }: Props) {
    return (
        <div className="rounded-2xl border border-white/40 bg-white/70 p-8 shadow-xl backdrop-blur-xl text-center">
            
            <div className="text-5xl mb-4">{code}</div>

            <h1 className="text-2xl font-bold text-gray-800">
                {title}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
                {description}
            </p>

            {children}
        </div>
    );
}