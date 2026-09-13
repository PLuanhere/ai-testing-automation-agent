"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext';

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [userDetail, setUserDetail] = useState<any>();

    useEffect(() => {
        CreateNewUser();
    }, [])

    const CreateNewUser = async () => {
        try {
            const result = await axios.post('/api/user', {})

            console.log("Result", result);

            setUserDetail(result.data?.user);
        } catch (error) {
            console.error("Create user failed", error);
        }
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div>{children}</div>
        </UserDetailContext.Provider>

    )
}
