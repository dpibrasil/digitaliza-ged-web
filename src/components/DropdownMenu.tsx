function Container(props: any)
{
    return <div className="absolute bg-white rounded">
        {props.children}
    </div>
}

function Item({name, ...rest}: React.HTMLAttributes<HTMLDivElement> & {name: string})
{
    return <div {...rest} className="px-4 text-neutral-700 text-sm bg-white hover:bg-neutral-100">
        {name}
    </div>
}

export default {Container, Item}