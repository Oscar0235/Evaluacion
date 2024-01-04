import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from './config';

interface GastoData {
  key: string;
  monto: string;
  descripcion: string;
  categoria: string;
}

export default function RegistroSreen() {
  const [id, setId] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [gastos, setGastos] = useState<GastoData[]>([]);

  useEffect(() => {
    const gastosRef = ref(db, 'gastos/');
    const obtenerGastos = () => {
      onValue(gastosRef, (snapshot) => {
        const data = snapshot.val();
        const gastosTemp: GastoData[] = data
          ? Object.keys(data).map((key) => ({
              key,
              ...data[key],
            }))
          : [];
        setGastos(gastosTemp);
      });
    };
    obtenerGastos();
  }, []);

  const limpiarCampos = () => {
    setId('');
    setMonto('');
    setDescripcion('');
    setCategoria('');
  };

  const agregarGasto = () => {
    const nuevoGastoRef = id.trim() !== '' ? ref(db, `gastos/${id}`) : push(ref(db, 'gastos/'));

    update(nuevoGastoRef, {
      monto: monto,
      descripcion: descripcion,
      categoria: categoria,
    });

    setMensaje('Registro agregado correctamente');
    limpiarCampos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Registro de Gastos</Text>

      {/* ID del gasto */}
      <TextInput
        style={styles.input}
        placeholder='ID del gasto '
        value={id}
        onChangeText={(texto) => setId(texto)}
      />

      {/* Resto de los campos */}
      <TextInput
        style={styles.input}
        placeholder='Monto del gasto'
        value={monto}
        onChangeText={(texto) => setMonto(texto)}
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        placeholder='Descripción del gasto'
        value={descripcion}
        onChangeText={(texto) => setDescripcion(texto)}
      />
      <TextInput
        style={styles.input}
        placeholder='Categoría del gasto'
        value={categoria}
        onChangeText={(texto) => setCategoria(texto)}
      />

      <Button title='Agregar Gasto' onPress={agregarGasto} />

      <Text style={[styles.message, mensaje.includes('Error') ? styles.errorText : styles.successText]}>
        {mensaje}
      </Text>

      <View style={styles.separator} />
      <Text style={styles.headerText}>Lista de Gastos</Text>
      <FlatList
        data={gastos}
        renderItem={({ item }) => (
          <View style={styles.gastoItem}>
            <Text>ID: {item.key}</Text>
            <Text>Monto: {item.monto}</Text>
            <Text>Descripción: {item.descripcion}</Text>
            <Text>Categoría: {item.categoria}</Text>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
  },
  successText: {
    color: 'green',
  },
  separator: {
    borderWidth: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  gastoItem: {
    marginBottom: 10,
  },
});