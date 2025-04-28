import React from 'react'
import { useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { getId } from './utils/utils';
// where users will be directed to if successfull login into cognito login page

const Auth = () => {
    const { isAuthenticated, user } = useAuth();
    let navigate = useNavigate();
// creating id pool if user is succesfully authenticated and the useAuth is coming from the odic content
    useEffect(() => {
        const fetchIdentityId = async () => {
            await getId(user?.id_token);
            navigate("/");
        }
        if (isAuthenticated) fetchIdentityId();
    })
    return (
        <div style={{ display: 'flex', width: '100vh', justifyContent: 'center' }}>Authenticating...</div>
    )
}

export default Auth