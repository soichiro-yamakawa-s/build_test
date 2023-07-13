// universeコード一覧の取得
export const fetchGetUniverse = async (universe) => {
    const getCode = await fetch(`./api/dividendsRead.do?F=code${universe}`)
    const response =  await getCode.json()
    return response;
}

export const fetchAPI = async (universe) => {
    const getdata =  await fetch(`./api/dividendsRead.do?F=${universe}`)
    const result =  await getdata.json()
    return result
}