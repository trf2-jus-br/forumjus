import React from 'react';
import { Chart } from 'react-google-charts';


interface Props {
    votos_favoraveis: number;
    votos_contrarios: number;
    quorum: number;
    key: string | null;
    visivel: boolean;
}

function Grafico({votos_contrarios, votos_favoraveis, quorum,visivel} : Props){
    const className = visivel ? 'opacity-100' : 'opacity-0';
    const aprovado = votos_favoraveis / quorum >= 2/3
    const abstencao = quorum - votos_contrarios - votos_favoraveis;

    return <div className={`votacao-grafico ${className}`}>
        <Chart 
            chartType='PieChart' 
            data={[
                ["", ""],
                [`${votos_favoraveis} Favoráveis`, votos_favoraveis],
                [`${votos_contrarios} Contrários`, votos_contrarios],
                [`${abstencao} Abstenções`, abstencao],
            ]} 
            options={{
                title: aprovado? 'Aprovado' : 'Rejeitado',
                theme: 'maximized',
                pieStartAngle: 180,
                colors: ['#070', '#700', '#888'],
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