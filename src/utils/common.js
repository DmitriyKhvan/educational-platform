function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
const uniqpBy = (arr) => {
  const unique = arr.filter(onlyUnique);
  return unique;
};

export { uniqpBy };
