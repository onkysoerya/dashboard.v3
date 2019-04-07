import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './css/stylein.css';

const POST_URI = "https://backend-bem.herokuapp.com/api/web/protected/postBerita";
export default class TambahBerita extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    judul : undefined,
    gambar : undefined,
    kategori : undefined,
    isi : undefined
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState : editorState,
      
    });
  };
  
  send = (event) =>{
    console.log(this.state);
    const body = {
      nama : this.state.judul,
      kategori : this.state.kategori,
      isi : draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
      gambar : this.state.gambar
    }
    console.log(body)
    fetch(POST_URI,{
      method : 'POST',
      headers: {
        "content-type": "application/json",
        "authorization": JSON.parse(localStorage.user).token
      },
        body : JSON.stringify(body)
    }).then(ress=>{
      if(ress.ok){
        return alert('Berhasil Dimasukkan');
      }else{
        return alert('gagal memasukkan');
      }
    })
    this.props.history.replace('/')
    event.preventDefault();
  }
  render() {
    
    const { editorState } = this.state;
    const UPLOAD_FILE = "https://api.imgur.com/3/image";
    return (
      <div>
        <Container>
        <Row>
          <Form encType="multipart/form-data" onSubmit={this.send}>
          <Form.Group controlId="formBasicText">
              <Form.Label>Judul</Form.Label>
              <Form.Control type="text" placeholder="Title here" name="judul" onChange={(val) => this.setState({judul: val.target.value})}/>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Kategori</Form.Label>
              <Form.Control as="select" onChange={(val) => this.setState({kategori: val.target.value})}>
                <option disabled selected>---Pilih Disini---</option>
                <option value="Advokesma">Advokesma</option>
                <option value="Bismit">Bismit</option>
                <option value="Kastrat">Kastrat</option>
                <option value="PSDM">PSDM</option>
                <option value="Perhub">Perhub</option>
                <option value="Inoya">Inoya</option>
                <option value="Sosma">Sosma</option>
                <option value="Medinfo">Medinfo</option>
                <option value="PIT">PIT</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicText">
              <Form.Label>Gambar</Form.Label>
              <Form.Control type="file" name="gambar" id="gambar" onChange={(event)=>{
                var formData = new FormData();
                var imagefile = document.querySelector('#gambar');
                formData.append("image", imagefile.files[0]);
                axios({
                  method: 'post',
                  url: UPLOAD_FILE,
                  headers: {
                    'Authorization' : 'Client-ID 66031c0605f8539'
                  },
                  data : formData
                }).then(res=>{
                  console.log(res.data.data.link);
                  this.setState({gambar: res.data.data.link});
                })
                event.preventDefault();
              }}/>
            </Form.Group>
            <Form.Group controlId="exampleForm.Controltextarea">
              <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
              placeholder="text here"
              onChange={(val) => {this.setState({isi : val.blocks[0].text})}}
            />
            </Form.Group>
            <Form.Group controlId="exampleForm.Controltextarea">
            <textarea
              value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            />
            </Form.Group>
            
            <Form.Group controlId="exampleForm.Controlsubmit">
            <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          
            </Form>
          </Row>
        </Container>
        
      </div>
    );
  }
}
