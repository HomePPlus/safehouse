import React, { useState } from 'react';
import styled from 'styled-components';

const AnimatedSearch = ({ onSearch, placeholder = "Type to search..." }) => {
    const [isActive, setIsActive] = useState(false);
    const [searchValue, setSearchValue] = useState("");
  
    const handleSearchToggle = (e) => {
      if (!isActive) {
        setIsActive(true);
        e.preventDefault();
      } else if (isActive && !e.target.closest('.input-holder')) {
        setIsActive(false);
        setSearchValue(""); // Clear search when closing
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSearch && searchValue.trim()) {
        onSearch(searchValue);
      }
    };
  
    return (
      <SearchWrapper className={isActive ? 'active' : ''}>
        <InputHolder className="input-holder" as="form" onSubmit={handleSubmit}>
          <SearchInput 
            className="search-input" 
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchIconButton 
            type="button"
            className="search-icon" 
            onClick={handleSearchToggle}
          >
            <SearchIconSpan />
          </SearchIconButton>
        </InputHolder>
        <CloseButton 
          className="close" 
          onClick={handleSearchToggle}
        />
      </SearchWrapper>
    );
  };

const SearchWrapper = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;

  &.active .input-holder {
    width: 450px;
    border-radius: 50px;
    background: rgba(0,0,0,0.5);
    transition: all .5s cubic-bezier(0.000, 0.105, 0.035, 1.570);
  }

  &.active .input-holder .search-input {
    opacity: 1;
    transform: translate(0, 10px);
  }

  &.active .input-holder .search-icon {
    width: 50px;
    height: 50px;
    margin: 10px;
    border-radius: 30px;
  }

  &.active .input-holder .search-icon span {
    transform: rotate(-45deg);
  }

  &.active .close {
    right: -50px;
    transform: rotate(45deg);
    transition: all .6s cubic-bezier(0.000, 0.105, 0.035, 1.570);
    transition-delay: 0.5s;
  }
`;

const InputHolder = styled.div`
  height: 70px;
  width: 70px;
  overflow: hidden;
  background: rgba(255,255,255,0);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease-in-out;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0px 70px 0 20px;
  opacity: 0;
  position: absolute;
  top: 0px;
  left: 0px;
  background: transparent;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-family: "Open Sans", Arial, Verdana;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: #FFF;
  transform: translate(0, 60px);
  transition: all .3s cubic-bezier(0.000, 0.105, 0.035, 1.570);
  transition-delay: 0.3s;
`;

const SearchIconButton = styled.button`
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 6px;
  background: #FFF;
  padding: 0px;
  outline: none;
  position: relative;
  z-index: 2;
  float: right;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
`;

const SearchIconSpan = styled.span`
  width: 22px;
  height: 22px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  transform: rotate(45deg);
  transition: all .4s cubic-bezier(0.650, -0.600, 0.240, 1.650);

  &::before {
    width: 4px;
    height: 11px;
    left: 9px;
    top: 18px;
    border-radius: 2px;
    background: #FE5F55;
    content: '';
    position: absolute;
  }

  &::after {
    width: 14px;
    height: 14px;
    left: 0px;
    top: 0px;
    border-radius: 16px;
    border: 4px solid #FE5F55;
    content: '';
    position: absolute;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  z-index: 1;
  top: 24px;
  right: 20px;
  width: 25px;
  height: 25px;
  cursor: pointer;
  transform: rotate(-180deg);
  transition: all .3s cubic-bezier(0.285, -0.450, 0.935, 0.110);
  transition-delay: 0.2s;

  &::before {
    position: absolute;
    content: '';
    background: #FE5F55;
    border-radius: 2px;
    width: 5px;
    height: 25px;
    left: 10px;
    top: 0px;
  }

  &::after {
    position: absolute;
    content: '';
    background: #FE5F55;
    border-radius: 2px;
    width: 25px;
    height: 5px;
    left: 0px;
    top: 10px;
  }
`;

export default AnimatedSearch;
