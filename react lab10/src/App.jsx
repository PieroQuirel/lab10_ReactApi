import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  state = {
    productos: [],
    categorias: [],
    recuperado: false,
    recuperadoCategorias: false,
    nuevoProducto: {
      nombre: '',
      precio: '',
      categoria: ''
    },
    productoEditando: {
      id: '',
      nombre: '',
      precio: '',
      categoria: ''
    },
    nuevaCategoria: {
      nombre: ''
    },
    categoriaEditando: {
      id: '',
      nombre: ''
    },
  };

  componentDidMount() {
    this.fetchProductos();
    this.fetchCategorias();
  }

  fetchProductos() {
    fetch('http://127.0.0.1:8000/api/producto')
      .then(response => response.json())
      .then(productos => {
        this.setState({productos, recuperado: true});
      })
      .catch(error => console.error('Error al recuperar productos:', error));
  }

  fetchCategorias() {
    fetch('http://127.0.0.1:8000/api/categoria')
      .then(response => response.json())
      .then(categorias => {
        this.setState({categorias, recuperadoCategorias: true});
      })
      .catch(error => console.error('Error al recuperar categorías:', error));
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      nuevoProducto: {
        ...prevState.nuevoProducto,
        [name]: value
      },
    }));
  };

  handleCategoriaInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      nuevaCategoria: {
        ...prevState.nuevaCategoria,
        [name]: value
      },
    }));
  };

  agregarProducto = () => {
    const csrfToken = 'el_valor_del_token_csrf';

    fetch('http://127.0.0.1:8000/api/producto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(this.state.nuevoProducto),
    })
      .then(() => {
        this.fetchProductos();
        this.setState({
          nuevoProducto: {
            nombre: '',
            precio: '',
            categoria: '',
          },
        });
      })
      .catch((error) => console.error('Error al agregar producto:', error));
  };

  agregarCategoria = () => {
    const csrfToken = 'el_valor_del_token_csrf';

    fetch('http://127.0.0.1:8000/api/categoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(this.state.nuevaCategoria),
    })
      .then(() => {
        this.fetchCategorias();
        this.setState({
          nuevaCategoria: {
            nombre: '',
          },
        });
      })
      .catch((error) => console.error('Error al agregar categoría:', error));
  };

  editarProducto = () => {
    if (this.state.productoEditando) {
      fetch(`http://127.0.0.1:8000/api/producto/${this.state.productoEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: this.state.productoEditando.nombre,
          precio: this.state.productoEditando.precio,
          categoria: this.state.productoEditando.categoria.id,
        }),
      })
        .then(() => {
          this.fetchProductos();
          this.setState({ productoEditando: null });
        })
        .catch((error) => console.error('Error al editar producto:', error));
    }
  };

  editarCategoria = () => {
    if (this.state.categoriaEditando) {
      fetch(`http://127.0.0.1:8000/api/categoria/${this.state.categoriaEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: this.state.categoriaEditando.nombre,
        }),
      })
        .then(() => {
          this.fetchCategorias();
          this.setState({ categoriaEditando: null });
        })
        .catch((error) => console.error('Error al editar categoría:', error));
    }
  };

  eliminarProducto = (id) => {
    fetch(`http://127.0.0.1:8000/api/producto/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        this.fetchProductos();
      })
      .catch((error) => console.error('Error al eliminar producto:', error));
  };

  eliminarCategoria = (id) => {
    fetch(`http://127.0.0.1:8000/api/categoria/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        this.fetchCategorias();
      })
      .catch((error) => console.error('Error al eliminar categoría:', error));
  };

  iniciarEdicionProducto = (producto) => {
    this.setState({ productoEditando: { ...producto } });
  };

  iniciarEdicionCategoria = (categoria) => {
    this.setState({ categoriaEditando: { ...categoria } });
  };

  cancelarEdicion = () => {
    this.setState({ productoEditando: null, categoriaEditando: null });
  };

  handleInputChangeEditarProducto = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      if (name === 'categoria') {
        return {
          productoEditando: {
            ...prevState.productoEditando,
            categoria: {
              ...prevState.productoEditando.categoria,
              id: value,
            },
          },
        };
      } else {
        return {
          productoEditando: {
            ...prevState.productoEditando,
            [name]: value,
          },
        };
      }
    });
  };

  handleInputChangeEditarCategoria = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      categoriaEditando: {
        ...prevState.categoriaEditando,
        [name]: value
      },
    }));
  };

  handleFiltroCategoriaChange = (e) => {
    this.setState({
      filtroCategoria: e.target.value,
    });
  };

  filtrarProductosPorCategoria = () => {
    const { filtroCategoria } = this.state;
    if (filtroCategoria) {
      const productosFiltrados = this.state.productos.filter(
        (producto) =>
          producto.categoria.nombre.toLowerCase().includes(filtroCategoria.toLowerCase())
      );
      this.setState({
        productos: productosFiltrados,
      });
    } else {
      this.fetchProductos();
    }
  };

  render() {
    if (this.state.recuperado && this.state.recuperadoCategorias) {
      return (
        <div className="container mt-5">
          <h1 style={{textDecoration : 'underline'}}>Laboratorio 10</h1>

<hr size="7" color="black"/>

          <h2 className="mt-4">Agregar Nuevo Producto</h2>
          <div className='row' style={{marginBottom : '50px'}}>
          <div className="form-group col-4">
            <label htmlFor="nombreProducto">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="nombreProducto"
              name="nombre"
              value={this.state.nuevoProducto.nombre}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group col-2">
            <label htmlFor="precioProducto">Precio:</label>
            <input
              type="text"
              className="form-control"
              id="precioProducto"
              name="precio"
              value={this.state.nuevoProducto.precio}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="categoriaProducto">Categoría:</label>
            <select
              className="form-control"
              id="categoriaProducto"
              name="categoria"
              value={this.state.nuevoProducto.categoria}
              onChange={this.handleInputChange}
            >
              <option value="" disabled>Selecciona una categoría</option>
              {this.state.categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary mt- col-2" onClick={this.agregarProducto}>Agregar Producto</button>
          </div>

<hr size="7" color="black"/>

          <h2 className="mt-4">Filtrar Productos por Categoría</h2>
          <div className="row">
          <div className="form-group col-8">
            <label htmlFor="filtroCategoria">Categoría:</label>
            <input
              type="text"
              className="form-control"
              id="filtroCategoria"
              name="filtroCategoria"
              value={this.state.filtroCategoria}
              onChange={this.handleFiltroCategoriaChange}
            />
            </div>
            <button className="btn btn-primary mt-3 col-2" onClick={this.filtrarProductosPorCategoria}>
            Filtrar Productos
          </button>
          </div>

<hr size="7" color="black"/>

          <h1 className="mb-4">Productos</h1>
          <table className="table table-hover table-sm">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Categoría</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{this.state.productoEditando && this.state.productoEditando.id === producto.id ? (
                    <input type="text" className="form-control" name="nombre"
                      value={this.state.productoEditando.nombre}
                      onChange={this.handleInputChangeEditarProducto}
                    />
                  ) : (
                    producto.nombre
                  )}</td>
                  <td>{this.state.productoEditando && this.state.productoEditando.id === producto.id ? (
                    <input type="text" className="form-control" name="precio"
                      value={this.state.productoEditando.precio}
                      onChange={this.handleInputChangeEditarProducto}
                    />
                  ) : (
                    producto.precio
                  )}</td>
                  <td>{this.state.productoEditando && this.state.productoEditando.id === producto.id ? (
                    <select className="form-control" name="categoria" 
                      value={this.state.productoEditando.categoria.id}
                      onChange={this.handleInputChangeEditarProducto}
                    >
                      <option value="" disabled>Selecciona una categoría</option>
                      {this.state.categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    producto.categoria.nombre
                  )}</td>
                  <td>
                    {this.state.productoEditando && this.state.productoEditando.id === producto.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={this.editarProducto}>Guardar</button>
                        <button className="btn btn-secondary btn-sm ml-2" onClick={this.cancelarEdicion}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button style={{marginRight : '10px'}} className="btn btn-warning btn-sm" onClick={() => this.iniciarEdicionProducto(producto)}>Editar</button>
                        <button className="btn btn-danger btn-sm ml-2" onClick={() => this.eliminarProducto(producto.id)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

<hr size="7" color="black"/>

          <h2 className="mt-4">Agregar Nueva Categoría</h2>
          <div className="form-group row">
            <div className="col-8">
            <label htmlFor="nombreCategoria">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="nombreCategoria"
              name="nombre"
              value={this.state.nuevaCategoria.nombre}
              onChange={this.handleCategoriaInputChange}
            />
            </div>
            <button className="btn btn-primary mt-3 col-2" onClick={this.agregarCategoria}>Agregar Categoría</button>
          </div>

<hr size="7" color="black"/>

          <h1 className="mb-4">Categorías</h1>
          <table className="table table-hover table-sm">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Categoría</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{this.state.categoriaEditando && this.state.categoriaEditando.id === categoria.id ? (
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={this.state.categoriaEditando.nombre}
                      onChange={this.handleInputChangeEditarCategoria}
                    />
                  ) : (
                    categoria.nombre
                  )}</td>
                  <td>
                    {this.state.categoriaEditando && this.state.categoriaEditando.id === categoria.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={this.editarCategoria}>Guardar</button>
                        <button className="btn btn-secondary btn-sm ml-2" onClick={this.cancelarEdicion}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button style={{marginRight : '10px'}} className="btn btn-warning btn-sm" onClick={() => this.iniciarEdicionCategoria(categoria)}>Editar</button>
                        <button className="btn btn-danger btn-sm ml-2" onClick={() => this.eliminarCategoria(categoria.id)}>Eliminar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <div className="text-center mt-5">Cargando los datos ...</div>;
    }
  }
}

export default App;
