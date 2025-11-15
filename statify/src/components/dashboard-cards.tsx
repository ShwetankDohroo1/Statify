type Field = {
    label: string;
    value: string | number;
};

type PlatformCardProps = {
    title: string;
    image?: string | null;
    name?: string | null;
    subtitle?: string | null;
    fields: Field[];
    footer?: React.ReactNode;
};

const PlatformCard = ({
    title,
    image,
    name,
    subtitle,
    fields,
    footer
}: PlatformCardProps) => {
    return (
        <div className="w-full p-4 bg-white rounded-lg shadow text-black">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            {(name || image) && (
                <div className="flex items-center gap-4 mb-4">
                    {image && (
                        <img
                            src={image}
                            className="w-16 h-16 rounded-full object-cover border"
                            alt={name ?? ""}
                        />
                    )}

                    <div>
                        {name && <p className="text-xl font-semibold">{name}</p>}
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {fields.map((item, idx) => (
                    <div key={idx}>
                        <p className="font-semibold">{item.label}:</p>
                        <p>{item.value}</p>
                    </div>
                ))}
            </div>

            {footer && <div className="mt-4">{footer}</div>}
        </div>
    );
}

export default PlatformCard;