import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { db } from './config';

interface GastoData {
  key: string;
  monto: string;
  descripcion: string;
  categoria: string;
}

const Informacion = ({ categoria, descripcion, monto }: GastoData) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>Categoría: {categoria}</Text>
    <Text style={styles.label}>Monto: {monto}</Text>
    <Text style={styles.label}>Descripción: {descripcion}</Text>
  </View>
);

export default function RegistroScreen() {
  const [selectedGasto, setSelectedGasto] = useState<GastoData | null>(null);
  const [gastos, setGastos] = useState<GastoData[]>([]);
  const [idInput, setIdInput] = useState<string>('');
  useEffect(() => {
    const gastosRef = ref(db, 'gastos/');
    onValue(gastosRef, (snapshot) => {
      const data = snapshot.val();
      const gastosTemp = data ? Object.keys(data).map((key) => ({ key, ...data[key] })) : [];
      setGastos(gastosTemp);
    });
  }, []);
  
  
  

  const obtenerRegistroPorId = (id: string) => {
    const registro = gastos.find((gasto) => gasto.key === id);
    registro
      ? Alert.alert('Detalles del Registro', `Categoría: ${registro.categoria}\nDescripción: ${registro.descripcion}`)
      : Alert.alert('Error', 'Registro no encontrado');
  };

  const obtenerMontos = () => {
    const montos = gastos.map((gasto) => gasto.monto);
    Alert.alert('Montos', montos.join('\n'));
  };

  const eliminarRegistro = (id: string) => {
    const gastoRef = ref(db, `gastos/${id}`);
    remove(gastoRef)
      .then(() => Alert.alert('Éxito', 'Registro eliminado correctamente'))
      .catch(() => Alert.alert('Error', 'Error al eliminar el registro'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <Text style={styles.heading}>Obtener Registro por ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese ID"
        value={idInput}
        onChangeText={(text) => setIdInput(text)}
      />
      <Button title="Obtener por ID" onPress={() => obtenerRegistroPorId(idInput)} />

      <View style={styles.separator} />
      <Text style={styles.heading}>Obtener Montos</Text>
      <Button title="Obtener Montos" onPress={obtenerMontos} />

      <View style={styles.separator} />
      <Text style={styles.heading}>Lista de Gastos</Text>
      <FlatList
        data={gastos}
        renderItem={({ item }) => (
          <View style={styles.gastoItem}>
            <Text style={styles.gastoId}>ID: {item.key}</Text>
            <Text style={styles.gastoText}>Monto: {item.monto}</Text>
            <Text style={styles.gastoText}>Descripción: {item.descripcion}</Text>
            <Text style={styles.gastoText}>Categoría: {item.categoria}</Text>
            <Button title="Eliminar Registro" onPress={() => eliminarRegistro(item.key)} />
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={selectedGasto !== null}
        onRequestClose={() => setSelectedGasto(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>Detalles del Gasto</Text>
            {selectedGasto && <Informacion {...selectedGasto} />}
            <Button title="Cerrar" onPress={() => setSelectedGasto(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  separator: {
    borderWidth: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  gastoItem: {
    marginBottom: 20,
  },
  gastoId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gastoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});
