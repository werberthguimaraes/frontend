import { Component, Input, OnInit } from '@angular/core';
import { ServicosFormsService } from '../../../@core/services/usuario-services';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  formUsuario!: FormGroup;
  listarUsuarios: UsuarioModel[] = [];
  isEditar: boolean = false;
  mostrarListarUsuariosCard: boolean = false;

  @Input() page: any;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private toastr: NbToastrService,
    private usuarioService: ServicosFormsService,
  ) {}

  ngOnInit(): void {
    this.inicializaFormGroup();
    this.carregarUsuarios();
  }


  inicializaFormGroup() {
    this.formUsuario = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassWord: ['', Validators.required]
    }, {
      validator: this.confirmaSenhaValidator
    });
  }

  confirmaSenhaValidator(group: FormGroup) {
    const senha = group.get('password')?.value;
    const confirmarSenha = group.get('confirmPassWord')?.value;
    return senha === confirmarSenha ? null : { notSame: true };
  }
  carregarUsuarios() {
    this.usuarioService.buscarUsuarios().subscribe(
      (usuarios: UsuarioModel[]) => {
        this.listarUsuarios = usuarios;
      },
      (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    );
  }



  carregarDadosParaEdicao(usuario: UsuarioModel): void {
    this.isEditar = true;
    if (usuario.id) {
      this.formUsuario.patchValue({
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        password: null,
      });
    } else {
      console.error('ID do usuário não definido:', usuario);
    }
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
  updateProdutoById(usuario: UsuarioModel) {
    if (!usuario.id) {
      console.error('Erro ao atualizar usuario: ID do produto está undefined');
      return;
    }
    this.usuarioService.updateUsuarios(usuario).subscribe({
      next: () => {
        this.toastr.success(`Produto com ID ${usuario.id} atualizado com sucesso.`, 'Sucesso');
        this.carregarUsuarios();
      },
      error: (erro) => {
        console.error('Erro ao atualizar usuario:', erro);
        this.toastr.danger(`Erro ao atualizar usuario ${usuario.id}.`, 'Erro');
      }
    });
  }


  deletarUsuario(id: number) {
    this.usuarioService.deleteUsuarios(id).subscribe({
      next: () => {
        this.toastr.success(`Usuario com ID ${id} deletado com sucesso.`, 'Erro');
        this.carregarUsuarios();
      },
      error: (erro) => {
        console.error('Erro ao deletar usuario:', erro);
        this.toastr.danger(`Erro ao deletar usuario ${id}.`, 'Erro');

      }
    });
  }

  toggleListarUsuariosCard() {
    this.mostrarListarUsuariosCard = !this.mostrarListarUsuariosCard;
  }


  onDeleteConfirm(id: number) {
    if (window.confirm('Deseja excluir o usuário?')) {
      this.usuarioService.deleteUsuarios(id).subscribe({
        next: () => {
          this.toastr.success(`Usuário com ID ${id} excluído com sucesso.`, 'Sucesso');
          this.carregarUsuarios();
        },
        error: (erro) => {
          if (erro.status !== 200) {
            console.error('Erro ao excluir usuário:', erro);
            this.toastr.danger('Erro ao excluir usuário', 'Erro');
          } else {
            this.toastr.success(`Usuário com ID ${id} excluído com sucesso.`, 'Sucesso');
            this.carregarUsuarios();
          }
        }
      });
    }
  }


}
