import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import NftListContainer from "../containers/NftListContainer";
import PersonInfoContainer from "../containers/PersonInfoContainer";
import SupportersListContainer from "../containers/SupportersListContainer";
import { getPersonInfoPage } from "../store/types/PersonInfo";


const PersonInfoPage = () => {
    
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const personInfoPage = useSelector( (state: any) => (state.personInfoPage))
    
    useEffect( () => {
        dispatch(getPersonInfoPage({page: 'supporters', username: pathname.slice(pathname.indexOf('@'))}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <PersonInfoContainer/>
            {
                personInfoPage.page === 'nft'
                ?
                <NftListContainer/>
                :
                <SupportersListContainer/>
            }
        </>
    )
}

export default PersonInfoPage