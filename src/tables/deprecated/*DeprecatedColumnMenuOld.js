import React from 'react'
import { Component } from 'react'

import Button from '@material-ui/core/Button'

import Select from 'react-select'
import { defaultTheme } from 'react-select'
// import SettingsIcon from '@material-ui/icons/Settings'
import settingsIcon from '../../assets/icons/plus-circle.svg'


/* example options
const options = [
  { value: 'genus', label: 'Genus', selected: true },
  { value: 'isolation_country', label: 'Isolation Country' },
  { value: 'host_name', label: 'Host Name' },
  { value: 'isolation_site', label: 'Isolation Site' },
  { value: 'genome_quality', label: 'Genome Quality' }
]
*/


const { colors } = defaultTheme

const selectStyles = {
  control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
}


export default class ColumnMenu extends Component {

  constructor(props) {
    super(props)

    const opts = props.columns.map(obj => ({...obj, value: obj.id}))

    this.state = {
      isOpen: false,
      options: opts,
      value: opts.filter(obj => !obj.hide)
    }
  }

  toggleOpen = () => {
    // don't close if clicking on drodown
    if (event.target.id.includes('react-select'))
      return

    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  onSelectChange = value => {
    this.toggleOpen()
    this.setState({ value })

    if (this.props.onChange)
      this.props.onChange(value)
  }

  render() {
    const { isOpen, options, value} = this.state
    return (
      <>
        <Dropdown
          isOpen={isOpen}
          onClose={this.toggleOpen}
          target={
            <Button
              size="small"
              variant="text"
              onClick={this.toggleOpen}
              disableRipple
            >
              <img src={settingsIcon} style={{height: 18}}/> <ChevronDown/>
            </Button>
          }
        >
          <Select
            autoFocus
            isMulti
            backspaceRemovesValue={false}
            components={{ DropdownIndicator, IndicatorSeparator: null }}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            menuIsOpen
            closeMenuOnSelect={false}
            onChange={this.onSelectChange}
            options={options}
            placeholder="Filter columns"
            styles={selectStyles}
            tabSelectsValue={false}
            value={value}
            styles={customStyles}
          />
        </Dropdown>
      </>
    )
  }
}

// Todo: both menuList and Menu needed to be altered
const customStyles = {
  menuList: base => ({
    ...base,
    backgroundColor: 'white',
    width: 300,
    maxHeight: 500,
  }),
}


const Menu = props => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)'
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        right: 0,
        position: 'absolute',
        zIndex: 9999, // must be higher than sticky table header
        width: 300,
        maxHeight: 700,
      }}
      {...props}
    />
  )
}

const Blanket = props => (
  <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
)

const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div style={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
)

const Svg = p => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
    {...p}
  />
)

const DropdownIndicator = () => (
  <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
)

const ChevronDown = () => (
  <Svg style={{ marginRight: -6 }}>
    <path
      d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </Svg>
)