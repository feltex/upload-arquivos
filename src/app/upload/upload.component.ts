import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpProgressEvent} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  private urlServicoUpload = environment.backendUrl + '/api/upload/arquivo';
  mensagem: string = '';
  nomeArquivo: string = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  // @ts-ignore
  onFileSelected(event) {
    const arquivoSelecionado: File = <File>event.target.files[0];

    if (arquivoSelecionado) {
      this.uploadArquivo(arquivoSelecionado);
    }
  }


  private uploadArquivo(arquivoSelecionado: File) {
    const formData = new FormData();
    formData.append("file", arquivoSelecionado);
    this.http.post(this.urlServicoUpload, formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        this.nomeArquivo = arquivoSelecionado.name;
        if (event.type === HttpEventType.UploadProgress) {
          // atualizar evento
          this.atualizarProgresso(event);
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
          this.mensagem = '';
        }
      });
  }


  private atualizarProgresso(evento: HttpProgressEvent) {
    try {
      // @ts-ignore
      const mensagemProgresso = 'Progresso do Upload: ' +  Math.round(evento.loaded / evento.total * 100) + '%';
      console.log(mensagemProgresso);
      this.mensagem = mensagemProgresso;

    } catch (error) {
      console.warn('erro', error);
    }
  }

}
