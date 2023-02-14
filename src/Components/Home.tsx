import "./Styles.css";
import logo from "./Images/logo.svg";
import moon from "./Images/icon-moon.svg";
import moon_dark from "./Images/icon-moon-dark.svg";
import play from "./Images/icon-play.svg";
import search from "./Images/icon-search.svg";
import arrow from "./Images/icon-arrow-down.svg";
import { SyntheticEvent, useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { styled } from "@mui/system";

const CustomToggle = styled(Switch)({
  padding: "5px",
  '& .Mui-checked + .MuiSwitch-track': {
    backgroundColor: "#A445ED !important",
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: "white",
  },
  '& .MuiSwitch-track': {
    backgroundColor: "grey",
    borderRadius: "100px !important"
  },
  
}) as typeof Switch;

function Body({jsonData} : any) {

  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [audioNotFound, setAudioNotFound] = useState<any>(false);

  useEffect(() => {
    try {
      let newAudio = new Audio((jsonData[0].phonetics).find((phonetic : any) => phonetic.audio !== "").audio);
      setAudio(newAudio);
      setAudioNotFound(false);
    } catch (e) {
      setAudioNotFound(true);
    }
  }, [jsonData]);
  
  return (
    <div className="content">
      <div className="header">
          <div>
            <div className="title">{jsonData[0].word}</div>
            <div className="pronunciation">{jsonData[0].phonetic}</div>
          </div>
          { audioNotFound || <img src={play} alt="" onClick={() => (audio?.play())} />}
        </div>
      <div className="body">
        
          {jsonData[0].meanings.map((meaning : any, index : number) => (
            <div className="figure" key={index}>
              <div className="title">
                <div>{meaning.partOfSpeech}</div>
                <div className="line"></div>
              </div>
              <div className="main">
                <div className="subtitle">Meaning</div>
                  {(meaning.definitions).map((def : any, index : number) => (
                      <ul key={index}>
                        <li><span>{def.definition}</span></li>
                      </ul>
                  ))}
                  {meaning.synonyms.length !== 0 && <div className="synonyms">
                  <div className="subtitle">Synonyms</div>
                  <div className="alt-text">{(meaning.synonyms).map((words : any) => words + " ")}</div>
                </div>}
                
              </div>
            </div>
          ))}
      </div>
      <div className="sources">
        <div className="text">Source</div>
        <a href={jsonData[0].sourceUrls[0]} target="_blank">{Wikipedia}</a>
      </div>
    </div>
  )
}

function NotFound() {

  return (
    <div className="not-found">
      <div className="sad-face">😕</div>
      <div className="title">No Definitions Found</div>
      <div className="description">Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</div>
    </div>
  )
}

function Home({dark, setDark} : any) {

  const [pageFound, setPageFound] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<any>();
  const [word, setWord] = useState<string>("");
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [font, setFount] = useState<string>("sans");

  function submitHandler(event : SyntheticEvent) : void {
    event.preventDefault();
    getData();
    
  }

  async function getData() {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    setJsonData(data);
    setPageFound(response.ok);
    setSearched(true);
    console.log(data);
    
  }
  
  return (
    <div className={`container ${font}`}>
      <nav>
        <img src={logo} alt="" />
        <div className="nav-components">
          <div onClick={() => setDropdown(!dropdown)} style={{cursor: "pointer"}}>
            <div>{font === "sans" ? "Sans Serif" : font === "serif" ? "Serif" : "Mono"}</div>
            <img src={arrow} alt="" />
          </div>
          {dropdown && <div className="dropdown">
            <div className="sans" onClick={() => {setFount("sans"); setDropdown(false)}}>sans</div>
            <div className="serif" onClick={() => {setFount("serif"); setDropdown(false)}}>serif</div>
            <div className="mono" onClick={() => {setFount("mono"); setDropdown(false)}}>mono</div>
          </div>}
          <CustomToggle onChange={(e) => setDark(e.target.checked)} />
          <img src={dark ? moon_dark : moon} alt="" />
        </div>
      </nav>

      <form onSubmit={submitHandler}>
        <input type="text" value={word} onChange={e => setWord(e.target.value)} />
        <button type="submit"><img src={search} alt="" /></button>
      </form>

      { searched && (pageFound ? <Body jsonData={jsonData} /> : <NotFound />)}
      
    </div>
  )
}

export default Home;