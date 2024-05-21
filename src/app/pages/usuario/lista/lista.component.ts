import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ServicosFormsService } from '../../../@core/services/usuario-services';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbToastrService, NbWindowService } from "@nebular/theme";
import {Router} from "@angular/router";
import { log } from 'console';

@Component({
  selector: 'ngx-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {

  listarUsuarios: UsuarioModel[] = [];
  formUsuario!: FormGroup;
  isEditar: boolean = false;


  @ViewChild('modalTemplate', {static: true}) modalTemplate: TemplateRef<any>;
  dialogReference: NbDialogRef<any>;

  openModal(modalTemplate) {
    this.windowService.open(
      modalTemplate,
      {
        title: 'Cadastro de Usuários',
        context: {
          text: 'some text to pass into template',
        },
      },
    );
  }


  constructor(
    public router: Router,
    private fb: FormBuilder,
    private windowService: NbWindowService,
    private toastr: NbToastrService,
    private usuarioService: ServicosFormsService,
  ) {}

  ngOnInit(): void {
    this.inicializaFormGroup();
    this.carregarUsuarios();
  }

  inicializaFormGroup() {
    this.formUsuario = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmarSenha: ['', Validators.required]
    }, {
      validator: this.confirmaSenhaValidator
    });
  }

  confirmaSenhaValidator(group: FormGroup) {
    const senha = group.get('password')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { notSame: true };
  }

  carregarUsuarios() {
    this.usuarioService.buscarUsuarios().subscribe(
      (usuarios: UsuarioModel[]) => {
        this.listarUsuarios = usuarios;
        console.log(this.listarUsuarios);
      },
      (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    );
  }


  limparUsuario() {
    this.isEditar = false;
    this.formUsuario.reset();
  }


  salvarUsuario() {
    if (this.formUsuario.valid) {
      const usuario = this.formUsuario.value;
      if (this.isEditar) {
        this.usuarioService.updateUsuarios(usuario).subscribe(
          () => {
            this.toastr.success('Usuário atualizado com sucesso', 'Sucesso');
            this.carregarUsuarios();
            this.limparUsuario();
          },
          (error: any) => {
            console.error('Erro ao atualizar usuário:', error);
            this.toastr.danger('Erro ao atualizar usuário', 'Erro');
          }
        );
      } else {
        this.usuarioService.salvarUsuario(usuario).subscribe(
          () => {
            this.toastr.success('Usuário salvo com sucesso', 'Sucesso');
            this.carregarUsuarios();
            this.limparUsuario();
          },
          (error: any) => {
            console.error('Erro ao salvar usuário:', error);
            this.toastr.danger('Erro ao salvar usuário', 'Erro');
          }
        );
      }
    } else {
      this.toastr.warning('Preencha todos os campos obrigatórios', 'Aviso');
    }
  }
  settings = {
    actions: {
      columnTitle: "Ações",
      add: false,
      delete: false,
      edit: false,
      position: 'right',
    },
    columns: {
      id: {
        title: 'Id',
        type: 'string',
      },
      name: {
        title: 'Nome',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },

    },
  };




}
