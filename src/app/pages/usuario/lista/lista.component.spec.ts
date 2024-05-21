import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaComponent } from './lista.component';
import { ServicosFormsService } from '../../../@core/services/usuario-services';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { NbToastrService, NbWindowService } from '@nebular/theme';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListaComponent', () => {
  let component: ListaComponent;
  let fixture: ComponentFixture<ListaComponent>;
  let mockServicosFormsService: Partial<ServicosFormsService>;

  const mockUsuario: UsuarioModel = {
    id: 1,
    name: 'Teste',
    email: 'teste@teste.com',
  };


  beforeEach(async () => {
    mockServicosFormsService = {
      buscarUsuarios: () => of([mockUsuario])
    };

     TestBed.configureTestingModule({
      declarations: [ ListaComponent ]
    });

    fixture = TestBed.createComponent(ListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    spyOn(mockServicosFormsService, 'buscarUsuarios').and.callThrough();
    component.ngOnInit();
    expect(mockServicosFormsService.buscarUsuarios).toHaveBeenCalled();
    expect(component.listarUsuarios).toEqual([mockUsuario]);
  });

  it('should save user', () => {
    spyOn(mockServicosFormsService, 'salvarUsuario').and.returnValue(of(null));
    spyOn(component, 'carregarUsuarios').and.callThrough();
    spyOn(component, 'limparUsuario').and.callThrough();

    component.formUsuario.patchValue(mockUsuario);
    component.isEditar = false;
    component.salvarUsuario();

    expect(mockServicosFormsService.salvarUsuario).toHaveBeenCalledWith(mockUsuario);
    expect(component.carregarUsuarios).toHaveBeenCalled();
    expect(component.limparUsuario).toHaveBeenCalled();
  });

  it('deveria ser criado com lista vazia (antes de buscar do serviço)', () => {
    expect(component.carregarUsuarios).toEqual([]);
  });

});
