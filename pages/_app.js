import React from 'react'
import Head from 'next/head'
import App, { Container } from 'next/app'

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge'></meta>
          <meta httpEquiv="content-language" content="ja"></meta>
          <title>配当金一覧(分割併合調整)</title>
          <link rel="icon" type="image/x-icon" href="static/favicon.ico"></link>
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp