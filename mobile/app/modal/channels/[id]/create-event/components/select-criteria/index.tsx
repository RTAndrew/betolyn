import { Ellipsis } from '@/components/icons'
import { ThemedView } from '@/components/ThemedView'
import { IMatch } from '@/mock/matches'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const criterias = [
  'Cartões amarelos',
  'Faltas cometidas por jogador',
  'Golos por atleta',
  'Golos por tempo de jogo',
  'Resultado Final (Golos)',
  'Resultado Final (Cartões amarelos)',
  'Resultado Final (Faltas cometidas por jogador)',
  'Resultado Final (Golos por atleta)',
  'Resultado Final (Golos por tempo de jogo)',
];

interface ChannelSelectCriteriaProps {
  match: IMatch
  onSelectCriteria: (criteria: string) => void
}

interface CriteriaItemProps {
  isCreate?: boolean
  criteria: string
  onPress: (criteria: string) => void
}

const CriteriaItem = ({ isCreate = false, criteria, onPress }: CriteriaItemProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(criteria)} style={[criteriaItemStyles.criteriaItem, isCreate ? criteriaItemStyles.criteriaItemCreate : criteriaItemStyles.criteriaItemSelect]}>
      <Text style={criteriaItemStyles.criteriaItemText}>{criteria}</Text>

      <View>
        <Ellipsis color="#485164" width={12} height={12} />
      </View>
    </TouchableOpacity>
  );
}

const ChannelSelectCriteria = ({ match, onSelectCriteria }: ChannelSelectCriteriaProps) => {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.container}>
        <Text>
          ChannelSelectCriteri a match {match.home_team} vs {match.away_team}
        </Text>

          <CriteriaItem isCreate criteria={"Criar critério"} onPress={() => onSelectCriteria("create-criteria")} />

        <View style={styles.criteriaList}>
          {criterias.map((criteria) => (
            <CriteriaItem key={criteria} criteria={criteria} onPress={onSelectCriteria} />
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#61687E',
  },
  criteriaList: {
    flexDirection: 'column',
    gap: 5,
    marginTop: 5,
  },
});

const criteriaItemStyles = StyleSheet.create({
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  criteriaItemCreate: {
    borderWidth: 1.5,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderColor: '#959CB2',
  },
  criteriaItemSelect: {
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#959CB2',
    borderBottomWidth: 0.5,
  },
  criteriaItemText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ChannelSelectCriteria