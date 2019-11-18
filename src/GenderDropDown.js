import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default function GenderDropDown() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Select Gender
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>Men</Dropdown.Item>
        <Dropdown.Item>Women</Dropdown.Item>
      </Dropdown.Menu>
  </Dropdown>
  )
}
