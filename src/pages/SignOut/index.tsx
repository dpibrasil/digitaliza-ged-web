import React from "react";
import { useAuth } from "../../context/AuthContext";

function SignOut() {

    const auth = useAuth()
    auth.signOut()

    return <>Desconectando...</>
}

export default SignOut;