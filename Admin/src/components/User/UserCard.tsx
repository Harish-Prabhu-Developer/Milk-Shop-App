// UserCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Branch } from '../../@types/User';

interface UserCardProps {
  branch: Branch;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard = ({ branch, onEdit, onDelete }: UserCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{branch.branchName}</Text>
        <Text style={styles.subtitle}>{branch.phone}</Text>
        <Text style={styles.location}>{branch.location} - {branch.routeName}</Text>
        <Text style={styles.tag}>{branch.type}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
          <MaterialIcons name="edit" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
          <MaterialIcons name="delete" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  tag: {
    marginTop: 6,
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconBtn: {
    padding: 8,
  },
});
