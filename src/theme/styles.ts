// src/theme/styles.ts
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F5",
  },
  flex1: {
    flex: 1,
  },
  appBar: {
    backgroundColor: "#FAF4F0",
    elevation: 2,
  },
  appBarTitle: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "left",
  },
  appBarBackAction: {
    color: "#F08080",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#F08080",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    color: "#fff"
  },
  textArea: {
    minHeight: 100,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  addButton: {
    backgroundColor: "#F08080",
    borderRadius: 30,
  },
  ingredientsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  ingredientItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  ingredientIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFE4E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#F08080",
    borderRadius: 12,
    width: 24,
    height: 24,
    zIndex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  ingredientQuantity: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFF8F5",
  },
  saveButton: {
    backgroundColor: "#F08080",
    borderRadius: 12,
    paddingVertical: 8,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  dialogTitle: {
    color: "#F08080",
  },
  dialogInput: {
    marginVertical: 12,
  },
  dialogButton: {
    backgroundColor: "#F08080",
    marginTop: 8,
  },
  ingredientButton: {
    marginVertical: 4,
    borderColor: "#F08080",
  },
  selectedItemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  snackbar: {
    backgroundColor: "#F08080",
  },
  scrollContainer: {

  },
  formContainer: {

  },
  salvarBotao: {

  },
  content: {
    padding: 16,
    flex: 1,
  },
  listContainer: {
    paddingBottom: 80,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  itemCardContent: {
    padding: 0,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#757575",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  itemIcon: {
    margin: 0,
  },
  quantityContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F08080",
  },
  unitText: {
    fontSize: 12,
    color: "#757575",
  },
  itemSeparator: {
    height: 8,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
    marginTop: 16,
  },
  emptyCardContent: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#757575",
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#F08080",
    borderRadius: 30,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantityInput: {
    flex: 3,
    marginRight: 8,
  },
  unitInput: {
    flex: 2,
  },
  unitsLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  unitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  unitButton: {
    marginRight: 8,
    marginBottom: 8,
    borderColor: "#F08080",
    borderRadius: 20,
  },
  unitButtonLabel: {
    fontSize: 12,
    color: "#F08080",
  },
  selectedUnitButton: {
    backgroundColor: "#FFE4E1",
    borderColor: "#F08080",
  },
  selectedUnitButtonLabel: {
    color: "#F08080",
    fontWeight: "500",
  },
  ingredienteItem: {

  },
  ingredienteIconContainer: {

  },
  ingredienteIconBackground: {},
  corPrincipal: {
    color: "#F08080"
  },
  ingredienteNome: {},
  ingredienteInfo: {},
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  recipeCardContent: {
    padding: 12,
  },
  recipeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  recipeIcon: {
    margin: 0,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
  recipeDivider: {
    marginVertical: 12,
    backgroundColor: "#F0F0F0",
    height: 1,
  },
  recipeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeYield: {
    fontSize: 13,
    color: "#F08080",
    fontWeight: "500",
  },
  recipeIngredients: {
    fontSize: 13,
    color: "#757575",
  },
  formSection: {
    marginBottom: 20,
  },
  formCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
    borderWidth: 0,
    elevation: 2,
  },

  inputContainer: {
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    paddingHorizontal: 0,
  },
  inputText: {
    fontSize: 16,
    color: "#333333",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
  },
  priceTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  priceTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F08080",
    marginRight: 8,
    marginBottom: 8,
  },
  priceTypeButtonSelected: {
    backgroundColor: "#FFE4E1",
  },
  priceTypeText: {
    fontSize: 14,
    color: "#F08080",
  },
  priceTypeTextSelected: {
    fontWeight: "500",
  },
  recipeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  recipeSelectorText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  recipeListContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  recipeList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  recipeItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recipeItemSelected: {
    backgroundColor: "#FFE4E1",
  },
  recipeItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  recipeItemSubtitle: {
    fontSize: 12,
    color: "#757575",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  productsList: {
    paddingBottom: 80,
  },
  productCard: {
    borderRadius: 12,
    padding: 0,
    marginHorizontal: 0,
    borderWidth: 0,
    elevation: 2,
    marginBottom: 12,
  },
  productCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productTitleContainer: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  productRecipe: {
    fontSize: 14,
    color: "#757575",
  },
  productPriceContainer: {
    alignItems: "flex-end",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F08080",
  },
  productPriceType: {
    fontSize: 12,
    color: "#757575",
  },
  formGroupTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  paymentOptionSelected: {
    backgroundColor: '#FFE4E1',
    borderColor: '#F08080',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  paymentOptionTextSelected: {
    color: '#F08080',
    fontWeight: '500',
  },
  productSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  productSelectorText: {
    fontSize: 16,
    color: '#333333',
  },
  productListContainer: {
    marginBottom: 16,
  },
  productList: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  productItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productItemSelected: {
    backgroundColor: '#FFE4E1',
  },
  productItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  productItemSubtitle: {
    fontSize: 12,
    color: '#757575',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedProductsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  selectedProductsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  selectedProductItem: {
    marginBottom: 8,
  },
  selectedProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  selectedProductDetails: {
    fontSize: 12,
    color: '#757575',
  },
  totalSection: {
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F08080',
  },
  actionButtons: {
    gap: 12,
  },
  pdfButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  quoteCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
    borderWidth: 0,
    elevation: 2,
    marginBottom: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  quoteDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  quoteTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F08080',
  },
  quoteDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  quoteDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quoteDetailTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginRight: 4,
  },
  quoteDetailText: {
    fontSize: 14,
    color: '#757575',
  },
  quoteProducts: {
    marginBottom: 8,
  },
  quoteProductItem: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 12,
    marginTop: 4,
  },
  quoteFooter: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  quoteFooterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quoteTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F08080',
  },
  savedQuotesSection: {
    marginTop: 10,
  },
  headerSection: {
    marginBottom: 24,
  },
  welcomeContainer: {
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  dateText: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  quotesSection: {
    marginBottom: 24,
  },
  viewAllText: {
    fontSize: 14,
    color: "#F08080",
    fontWeight: "500",
  },
  quoteProductCount: {
    fontSize: 14,
    color: "#757575",
  },
  viewDetailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFE4E1",
    borderRadius: 16,
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#F08080",
    fontWeight: "500",
  },
  missingStockSection: {
    marginBottom: 24,
  },
  missingStockCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
    borderWidth: 0,
    elevation: 2,
  },
  missingStockItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  missingStockIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  missingStockInfo: {
    flex: 1,
  },
  missingStockName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  missingStockQuantity: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  addToStockButton: {
    backgroundColor: "#F08080",
    borderRadius: 8,
    marginTop: 16,
  },
  addToStockButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    padding: 0,
    marginHorizontal: 0,
    borderWidth: 0,
    elevation: 2,
    marginBottom: 12,
  },
  statContent: {
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  statLabel: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
});
