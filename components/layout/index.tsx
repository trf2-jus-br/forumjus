import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBuildingColumns, faSkull } from '@fortawesome/free-solid-svg-icons'
import { usarContexto } from '../../contexto';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { retornoAPI } from '../../utils/api-retorno';
import CabecalhoPadrao from './cabecalho';

export const siteTitle = 'Jornada';

type Props = React.PropsWithChildren & {
    fluid?: boolean;
    cabecalho?: React.ReactNode
}

export default function Layout({ children, fluid, cabecalho } : Props) {
    const container = fluid ? 'container-fluid px-5' : 'container';

    return (<div className='d-flex flex-column' style={{minHeight: '100vh'}}>
        <Head>
            <link rel="icon" href="/favicon-32x32.png" />
            <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
            />
            <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <title>{siteTitle}</title>
        </Head>
        
        {cabecalho || <CabecalhoPadrao fluid={fluid} />}

        <div className={`${container} mb-3 d-flex flex-column`} style={{flex: 1}}>
            {children}
        </div>
    </div>
    );
}