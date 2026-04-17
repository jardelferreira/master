export default function Gradient() {
    return (
        <>
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-blue-100/80 to-transparent" />
            <div className="absolute -top-12 right-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky-100/60 blur-3xl" />
        </>
    )
}