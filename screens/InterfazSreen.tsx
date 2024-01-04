import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from './config';

interface GastoData {
  key: string;
  id: string;
  monto: string;
  descripcion: string;
  categoria: string;
}

export default function UsuarioScreen() {
  const [gastos, setGastos] = useState<GastoData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [editedMonto, setEditedMonto] = useState('');
  const [editedDescripcion, setEditedDescripcion] = useState('');
  const [editedCategoria, setEditedCategoria] = useState('');

  useEffect(() => {
    const gastosRef = ref(db, 'gastos/');
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
  }, []);

  const editarGasto = (id: string) => {
    const gasto = gastos.find((g) => g.key === id);
    if (gasto) {
      setEditingKey(gasto.key);
      setEditedMonto(gasto.monto);
      setEditedDescripcion(gasto.descripcion);
      setEditedCategoria(gasto.categoria);
      setModalVisible(true);
    } else {
      Alert.alert('Error', 'No se encontró el registro con el ID proporcionado');
    }
  };

  const confirmarEliminarGasto = (id: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este registro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => eliminarGasto(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const eliminarGasto = (id: string) => {
    remove(ref(db, `gastos/${id}`));
    Alert.alert('Registro Eliminado', 'El registro se ha eliminado correctamente');
  };

  const guardarCambios = () => {
    update(ref(db, `gastos/${editingKey}`), {
      monto: editedMonto,
      descripcion: editedDescripcion,
      categoria: editedCategoria,
    });
    setModalVisible(false);
    Alert.alert('Registro Editado', 'El registro se ha editado correctamente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Gastos</Text>
      <FlatList
        data={gastos}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>ID: {item.key}</Text>
            <Text>Monto: {item.monto}</Text>
            <Button title='Editar' onPress={() => editarGasto(item.key)} />
            <Button title='Eliminar' onPress={() => confirmarEliminarGasto(item.key)} color='red' />
          </View>
        )}
        keyExtractor={(item) => item.key}
      />

      <Modal visible={modalVisible} animationType='slide'>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Editar Gasto</Text>
          <Text>ID: {editingKey}</Text>
          <TextInput
            style={styles.input}
            placeholder='Monto'
            value={editedMonto}
            onChangeText={setEditedMonto}
          />
          <TextInput
            style={styles.input}
            placeholder='Descripción'
            value={editedDescripcion}
            onChangeText={setEditedDescripcion}
          />
          <TextInput
            style={styles.input}
            placeholder='Categoría'
            value={editedCategoria}
            onChangeText={setEditedCategoria}
          />
          <Text style={styles.modalHeader}>ID: {editingKey}</Text>
          <Button title='Guardar Cambios' onPress={guardarCambios} />
          <Button title='Cancelar' onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#3498db',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 3,
    marginBottom: 5,
    padding: 10,
    minWidth: 200,
  },
});
