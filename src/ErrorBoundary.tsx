import React from 'react'
import styled from 'styled-components'

type State = {
  hasError: boolean
  error: any
  errorInfo: any
}

class ErrorBoundary extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error}
  }

  componentDidCatch(error, errorInfo) {
    this.setState({error, errorInfo})
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Root>
          <h1>Something went wrong.</h1>
          <pre>
            {this.state.error.toString()}
          </pre>
          {this.state.errorInfo && 'componentStack' in this.state.errorInfo &&
            <pre>
              {this.state.errorInfo.componentStack}
            </pre>
          }
        </Root>
      )
    }

    return this.props.children
  }
}

const Root = styled.div`
  padding: 20px;
`

export default ErrorBoundary