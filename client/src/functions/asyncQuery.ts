const asyncQuery = async (
    type: string, 
    url: string, 
    body?: any
) => {

    const options: any = 
        body
        ?
        {
            method: type,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials': 'true',
                Accept: 'application/json',
            },
            credentials:"include",
            mode:'cors',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(body)
        }
        :
        {
            method: type,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials': 'true',
                Accept: 'application/json',
            },
            credentials:"include",
            mode:'cors',
            referrerPolicy: 'no-referrer',
        }

    const response = await fetch(
          url,
        options
    )

    if (response.status === 200) {
        const result = await response.json()
        console.log(result)
        return result
    } else if (response.status === 401) {
        return false
    }

}

export default asyncQuery
