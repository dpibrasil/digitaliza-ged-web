import { useAuth } from "../context/AuthContext";
import { UserTypes } from "../types/UserTypes";

const levels: Record<UserTypes, number> = {
    'super-admin': 4,
    admin: 3,
    operator: 2,
    client: 1
}

interface RequireUserTypeProps {
    children: any,
    type: UserTypes
}

function RequireUserType({children, type}: RequireUserTypeProps): JSX.Element
{
    const {userData} = useAuth()
    return userData && levels[userData.type] >= levels[type] ? children : <></>
}

export default RequireUserType;