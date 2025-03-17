import { useAuth } from "@clerk/nextjs";

export function useWebsites(){
    const {getAuth} = useAuth();
}