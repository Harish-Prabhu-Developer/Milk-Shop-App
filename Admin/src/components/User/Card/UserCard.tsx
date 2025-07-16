import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type UserCardProps = {
  name: string;
  branch: string;
  role: string;
  email?: string;
  status?: 'Active' | 'Inactive';
};

const UserCard = ({ name, branch, role, email, status = 'Active' }: UserCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={require('../../../assets/Images/Profile.png')} className="w-16 h-16 rounded-full" />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>{branch} • {role}</Text>
          {email && <Text style={styles.email}>{email}</Text>}
        </View>
      </View>

      <View style={[styles.statusBadge, status === 'Active' ? styles.active : styles.inactive]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  meta: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: '#D1FAE5',
  },
  inactive: {
    backgroundColor: '#FECACA',
  },
  statusText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
});
