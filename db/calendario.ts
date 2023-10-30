class CalendarioDAO {
    static async hoje(db: PoolConnection){
        const [eventos] = await db.query(
            `SELECT * 
                FROM calendario 
                WHERE 
                    inicio < now() AND fim > now();`
        );

        return eventos as Calendario[]
    }
}

export default CalendarioDAO;