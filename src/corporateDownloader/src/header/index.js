import * as React from 'react';
import './index.css';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function Header() {

    return (
        <div id='header'>
            <div id='h_title'>
                <h1 id='h_service'>
                    <img src='./QUICK_Logo_white.png' alt=''/>企業情報ダウンローダー
                </h1>
                <div id='h_links'>
                    <a target="_blank" href="./corporateDownloader_help.pdf"><HelpOutlineIcon sx={{ color: "#ffffff" }}/></a>
                </div>
            </div>
        </div>
    );
  }