import React, {useState} from 'react'

const Search = ({setSearch}) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
      setSearch(e.target.value);
    };
  
    
    const containerStyle = {
      
     
      marginInlineStart: 'auto' , 
      // color:"black",
      border:"1px solid silver",
   
       marginRight: 10,
      padding:5,
   
      borderRadius:5,
      };
  
    return (
     <div style={{maxWidth:350,textAlign:"center",}}>
       <input 
        placeholder="Search for a crypto"
        variant="outlined"
        style={containerStyle}
        value={inputValue}
        onChange={handleInputChange}
      >
      </input>
    
     </div>
    );
}

export default Search