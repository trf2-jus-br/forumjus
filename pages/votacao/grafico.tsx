import React from 'react';
import { Chart } from 'react-google-charts';


interface Props {
    votos_favoraveis: number | null;
    votos_contrarios: number | null;
    key: string | null;
    visivel: boolean;
}

function Grafico({votos_contrarios, votos_favoraveis,visivel} : Props){
    const className = visivel ? 'opacity-100' : 'opacity-0';
    const aprovado = votos_favoraveis && votos_favoraveis / (votos_favoraveis + votos_contrarios) >= 0.75
    
    return <div className={`votacao-grafico ${className}`}>
        <Chart 
            chartType='PieChart' 
            data={[
                ["", ""],
                [`${votos_favoraveis} favoráveis`, votos_favoraveis],
                [`${votos_contrarios} contrários`, votos_contrarios],
            ]} 
            options={{
                theme: 'maximized',
                pieStartAngle: 180,
                colors: ['#070', '#700'],
                legend: {
                    position: 'right',
                    alignment: 'center',
                },
                chartArea: {'width': '100%', 'height': '80%'},
            }}
            width={'100%'}
            height={"300px"} 
        />
        <h3 style={{position: 'absolute', right:'32%', top: '27%', color:  aprovado ? '#070' : '#700' }}>{aprovado? 'Aprovado' : 'Rejeitado'}</h3>
    </div>
}

export default Grafico;