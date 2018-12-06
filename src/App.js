import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';
import axios from "axios";
import jsxToString from 'jsx-to-string';


const ColorArr = [{ value: 'darkgray', label: 'darkgray' }, 
                  { value: 'purple', label: 'purple' }, 
                  { value: 'blue', label: 'blue' },
                  { value: 'green', label: 'green' },
                  { value: 'black', label: 'black' },
                  { value: 'orange', label: 'orange' }];

const FontSizeArr = [{ value: '1em', label: '1em' }, 
                     { value: '1.5em', label: '1.5em' }, 
                     { value: '2em', label: '2em' }, 
                     { value: '2.5em', label: '2.5em' },
                     { value: '3em', label: '3em' },
                     { value: '3.5em', label: '3.5em' }]

class FormPage extends Component {
  constructor(props){
    super(props);
    this.state={
      title : '',
      titleColor:{value:'black', label:'black'},
      titleSize: { value: '1em', label: '1em' },
      fontSize: {value:'1em', label:'1em'},
      fontColor: {value:'black', label:'black'},
      iconImg:'',
      searchVal: 'Search for Icons!',
      token:'',
      data: [], 
      searchClassName:'search hide'
    }
  }

  handleColor = (selectedColor) => {
    this.setState({ fontColor: selectedColor });
  }
  
  handleFont = (selectedFont) => {
    this.setState({ fontSize: selectedFont });
  }

  handleTitleSize = (selectedSize) => {
    this.setState({ titleSize: selectedSize});
  }

  handleTitleColor = (selectedColor) => {
    this.setState({ titleColor: selectedColor });
  }

  handleTitle = (e) => {
    this.setState({title: e.target.value});
  }

  searchIcons = (e) => {
    this.setState({searchVal: e.target.value});
  }

  getIcons = () => {
    axios({
        method:'get',
        url:'/ping',
        params: { val: this.state.searchVal } 
    })
      .then(({data}) => { 
         this.setState({
           data : data.icons || [],
           searchClassName: 'search'
         });
      });
  }

  closeSearchTab = () => {
    console.log('close tab');
    this.setState({
      searchClassName: 'search hide'
    });
  }

  setImg = (iconImg) => {
    return () => {
      this.setState({
        iconImg,
      });
    }
  }
  
  postPdf = (e) => {
    e.preventDefault();
    console.log({ 
        title: this.state.title,
        titleColor: this.state.titleColor.value,
        fontColor: this.state.fontColor.value,
        fontSize: this.state.fontSize.value,
        icon: this.state.iconImg
      } );
    axios({
      method:'post',
      url:'/ping2',
      data: { 
        title: this.state.title,
        titleSize: this.state.titleSize.value,
        titleColor: this.state.titleColor.value,
        fontColor: this.state.fontColor.value,
        fontSize: this.state.fontSize.value,
        icon: this.state.iconImg
      } 
    }).then((r)=>{
      window.open("/preview.pdf");
    })
   }

  componentDidMount() {
    document.body.addEventListener('click', this.closeSearchTab);
  }

  render(){
    console.log('--state', this.state);
    const imgList = this.state.data.map((e,i) =>{
     return (<img src={e.preview_url_42}
                  key={e.id}
                  alt=''
                  width='64'
                  onClick={this.setImg(e.preview_url_42)}
                />
            )
    });
    return (
      <div className={this.props.className}>
        <div className="form">
          <div className="row">
            <h8 className="col-md-3" >Name of Kitchen:</h8>
            <input className="col-md-8" 
                   type="text" 
                   onChange={this.handleTitle}
                   value={this.state.title}/>
          </div>
          <div className="searchrow row">
              <div className="col-md-10 form-inline md-form form-sm">
                <input className="form-control form-control-sm mr-3 w-75" 
                       type="text" 
                       placeholder={this.state.searchVal} 
                       value={this.state.searchVal}
                       onChange={this.searchIcons}
                       aria-label="Search" />
              </div> 
              <div className={this.state.searchClassName}>
                <p>choose kitchen log:</p>
                { imgList } 
                <p>*these logos are owned by thenounproject.com</p>
              </div>
              <button type="button" 
                      className="btn btn-info col-md-2 searchbtn"
                      onClick={this.getIcons}>
                <span className="glyphicon glyphicon-search">
                </span> Search
              </button>
          </div>
          <div className="rinfo searchrow">
            Welcome:<br />
             <ol> 1. Please insert the title of your kitchen.</ol>
             <ol> 2. Choose an icon if you like for your kitchen.                                         logo. </ol>
             <ol> 3. Use styling buttons to style text of reciept!</ol>
               Thats it! Thank you for using my product!
          </div>
          <div className="row searchrow">
            Set Themes for font:
          </div>
          <div className="theme-btns">
           <div className="title-select"> Title style:
              <Select
                value={this.state.titleColor}
                onChange={this.handleTitleColor}
                options={ColorArr}
              />
              <Select
                value={this.state.titleSize}
                onChange={this.handleTitleSize}
                options={FontSizeArr}
              />
            </div>
            <div className="address-select"> address:
              <Select
                value={this.state.fontSize}
                onChange={this.handleFont}
                options={FontSizeArr}
              />
              <Select
               value={this.state.fontColor}
               onChange={this.handleColor}
               options={ColorArr}
              />
            </div>
            <button 
              type="button" 
              className="btn btn-primary btn-lg btn-block"
              onClick={this.postPdf}
             >
                Submit  
            </button> 
          </div>
        </div>
        <PreviewComponent
          iconImage ={this.state.IconImge}
          fontSize={this.state.fontSize.value}
          fontColor={this.state.fontColor.value}
          icon={this.state.iconImg}
          title={this.state.title}
          titleColor={this.state.titleColor.value}
          titleSize={this.state.titleSize.value}
        />
      </div>
    );
  }
}

const PreviewComponent = ({fontSize,fontColor, icon, title,
  titleSize, titleColor}) => {
    return ( 
       <div className="mainContainer">
        <div className="recContainer">
          <div className="row">
            <img className="col-md-3" src={icon} alt='' />
            <div  style={{color:`${titleColor}`, 
                  fontSize:`${titleSize}` }}
                className="col-md-9"
                 > 
              {title} 
            </div>
          </div>
          <hr />
          <div className="address-prv" 
               style={{color: `${fontColor}`,         
                      fontSize:`${fontSize}`}} > 
              1234 Sample Drive <br /> 
              Overthere, CA 90000  USA <br />
              email: sample@sample.com
          </div>
          <div className="dateTime">
            date: 00-00-00  time: XX:XX
          </div>
          <div className="priceContainer">
            <p className="price"> 
              Price: $ XX.XX 
              <br />
              Sales: $ XX.XX 
              <br />
              Total: $ XX.XX 
            </p>            
          </div>
          <h6 className="thanks">
           Thank you for ordering from {title} kitchen!
          </h6>
        </div>
       </div>
    );
}

class App extends Component {
  render() {
    return (
      <div className="App fluid-conatiner">
          <FormPage className="main" />
      </div>
    );
  }
}

export default App;
