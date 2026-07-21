type Props = {
    children: React.ReactNode;
};

export default async function DocumentsLayout({ children }: Props) {
    return <div>{children}</div>;
}
