const ENTITIES = [
  'Entity 1',
  'Entity 2',
  'Entity 3',
  'Entity 4',
  'Entity 5',
  'Entity 6',
  'Entity 7',
  'Entity 8',
  'Entity 9',
  'Entity 10',
  'Entity 11',
  'Entity 12',
  'Entity 13',
  'Entity 14',
  'Entity 15',
  'Entity 16',
  'Entity 17',
  'Entity 18',
  'Entity 19',
  'Entity 20',
  'Entity 21',
  'Entity 22',
  'Entity 23',
  'Entity 24',
  'Entity 25',
  'Entity 26',
  'Entity 27',
  'Entity 28',
  'Entity 29',
  'Entity 30',
];
const GROUPS = [
  {
    id: 1,
    name: 'Group 1',
    level: 1,
    entities: [],
    parent: null,
    children: [3, 4],
  },
  {
    id: 2,
    name: 'Group 2',
    level: 1,
    entities: [],
    parent: null,
    children: [],
  },
  {
    id: 3,
    name: 'Group 3',
    level: 2,
    entities: [],
    parent: 1,
    children: [],
  },
  {
    id: 4,
    name: 'Group 4',
    level: 2,
    entities: [],
    parent: 1,
    children: [],
  },
];

const root = document.getElementById('root');
const sortingWrapper = document.getElementById('sorting-wrapper');
const entitiesWrapper = document.getElementById('entities-wrapper');

class Group {
  constructor(id, name, level, entities = [], parent, children = []) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.entities = entities;
    this.parent = parent;
    this.children = children;
  }

  createGroupElement() {
    const groupElement = document.createElement('div');

    groupElement.classList.add('group');
    groupElement.setAttribute('ondrop', 'drop(event)');
    groupElement.setAttribute('ondragover', 'allowDrop(event)');

    const contentElement = document.createElement('div');
    contentElement.classList.add('child-group');

    contentElement.id = this.id;

    const addGroupButton = document.createElement('button');
    addGroupButton.textContent = '+';
    addGroupButton.classList.add('add-group-button');
    contentElement.appendChild(addGroupButton);

    const input = document.createElement('input');
    input.value = this.name;
    input.classList.add('group-name-input');
    input.addEventListener('input', (event) => {
      this.name = event.target.value;
    });

    contentElement.appendChild(input);

    groupElement.appendChild(contentElement);

    const childGroupsContainer =
      createChildGroupContainer(groupElement);

    const children = GROUPS.filter(
      (group) => group.parent === this.id
    );

    children.map((childGroup) => {
      const childGroupElement = new Group(
        childGroup.id,
        childGroup.name,
        childGroup.level,
        childGroup.entities,
        childGroup.parent,
        childGroup.children
      ).createGroupElement();

      childGroupsContainer.appendChild(childGroupElement);
    });

    addEventListenerToGroupElement(
      childGroupsContainer,
      addGroupButton,
      this
    );

    return groupElement;
  }
}

function addEventListenerToGroupElement(
  childGroupsContainer,
  button,
  group = null
) {
  button.addEventListener('click', () => {
    if (childGroupsContainer.children.length < 2) {
      for (let i = 0; i < 2; i++) {
        const UUID = crypto.randomUUID();

        const newChildGroup = new Group(
          UUID,
          'Group name',
          group ? group.level + 1 : 1,
          [],
          group ? group.id : null,
          []
        );

        GROUPS.push(newChildGroup);

        const newChildGroupElement =
          newChildGroup.createGroupElement();
        childGroupsContainer.appendChild(newChildGroupElement);
      }

      window.scrollTo({
        left: sortingWrapper.scrollWidth,
        behavior: 'smooth',
      });
    }
  });
}

function createChildGroupContainer(parentElement) {
  const childGroupsContainer = document.createElement('div');
  childGroupsContainer.classList.add('child-groups');
  parentElement.appendChild(childGroupsContainer);

  return childGroupsContainer;
}

function createEntityList() {
  ENTITIES.forEach((entity) => {
    const entityElement = document.createElement('div');
    entityElement.textContent = entity;
    entityElement.setAttribute('draggable', 'true');
    entityElement.setAttribute('ondragstart', 'drag(event)');
    entityElement.classList.add('entity-option');
    entityElement.id = entity;
    entitiesWrapper.appendChild(entityElement);
  });

  const childGroupsContainer =
    createChildGroupContainer(sortingWrapper);

  const rootGroups = GROUPS.filter((group) => group.level === 1);

  rootGroups.map((group) => {
    const newGroup = new Group(
      group.id,
      group.name,
      group.level,
      group.entities,
      group.parent,
      group.children
    ).createGroupElement();

    childGroupsContainer.appendChild(newGroup);
  });

  addEventListenerToGroupElement(
    childGroupsContainer,
    sortingWrapper
  );
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  var data = ev.dataTransfer.getData('text');

  const groupId = ev.target.id;

  const entity = data;

  const group = findGroup(groupId);

  if (!group) {
    return;
  }

  const hasEntity = group.entities.includes(entity);

  const entityInOtherGroup = checkEntityInGroupOrSubgroups(
    entity,
    group
  );

  const entityInParentGroup = checkEntityInParentGroup(entity, group);

  if (
    group &&
    !hasEntity &&
    !entityInOtherGroup &&
    entityInParentGroup
  ) {
    var entityClone = document.getElementById(data).cloneNode(true);

    ev.target.appendChild(entityClone);

    group.entities.push(entity);
  }
}

function checkEntityInGroupOrSubgroups(entity, group) {
  const isRoot = group.level === 1;
  let sibling = [];

  if (isRoot) {
    sibling = GROUPS.find(
      (sibling) => sibling.level === 1 && sibling.id !== group.id
    );
  } else {
    sibling = GROUPS.find(
      (sibling) =>
        sibling.parent === group.parent && sibling.id !== group.id
    );
  }

  return sibling.entities.includes(entity);
}

function checkEntityInParentGroup(entity, group) {
  if (group.level == 1) {
    return true;
  }

  const parentGroup = findGroup(group.parent);

  if (parentGroup.entities.includes(entity)) {
    return true;
  }

  return false;
}

function findGroup(id) {
  return GROUPS.find((group) => group.id == id);
}

createEntityList();
