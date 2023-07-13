import React from 'react'
import Head from 'next/head'
import App from 'next/app'

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <div>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge'></meta>
          <meta httpEquiv="content-language" content="ja"></meta>
          <title>サプライチェーンビュー</title>
          <link rel="icon" type="image/x-icon" href="static/favicon.ico"></link>
        </Head>
        <Component {...pageProps} />
      </div>
    )
  }
}

export default MyApp