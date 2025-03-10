<template>
  <main id="app">
    <!-- Menu de recherche -->
    <section class="filtres">
      
      <div class="First">
      <div>
        <input type="text" placeholder="Tapez le nom de la pièce" v-model="search">
      </div>
      <div>
        <select v-model="sortOrder">
          <option :value="0">Default (Not Sorted)</option>
          <option :value="1">Croissant (Ascending)</option>
          <option :value="2">Décroissant (Descending)</option>
        </select>
      </div>
    <div>
  <label>
    <input type="radio" v-model="Disponibility" :value="true" />
    Afficher uniquement les articles disponibles
  </label>

  <label>
    <input type="radio" v-model="Disponibility" :value="false" />
    Afficher toutes les pièces
  </label>
</div>

      </div>
      <div class="cat">
      <div v-for="(categoryName, index) in categories" :key="index">
        <label>
          <input type="checkbox" :value="categoryName" v-model="selectedCategories" />
          {{ categoryName }}
        </label>
      </div>
      </div>
    </section>
    <!-- Panier -->
    <section class="panier">
      <fieldset>
        <legend >Panier</legend>
        <p>Total: {{ total }} $</p>
        <div v-for="item in cart" :key="item.id">
          <div>
            {{ item.nom }} - {{ item.prix }} $
            <button class="b2" @click="RemoveFromCart(item)">Retirer du panier</button>
          </div>
        </div>
      </fieldset>
    </section>

    <!-- Fiches produits -->
    <section class="fiches" >
      <div class="items">
      <div class="item" v-for="(item, index) in filteredItems" :key="index">
      <p class="prix">
        <strong>{{ item.nom }}</strong><br>
        <b class="tt">Prix:</b> {{ item.prix }} $
      </p>
      <img :src="item.Image" alt="Image">
      <br><button class="Button" @click="AddItem(item)">Ajouter au panier</button>
      </div>
      </div>
    </section>

    
  </main>
</template>

<script>
export default({
  data() {
    return {
      items: [],
      cart: [], // To store the cart items
      total: 0,
      search: "",
      selected: [],
      sortOrder: 0,
      selectedCategories: [], // Store the selected categories
      Disponibility: "",
      categories: [
        "Électricité", "Filtration", "Moteur", "Freinage", "Refroidissement",
        "Suspension", "Sécurité", "Carrosserie", "Échappement", "Transmission",
        "Direction", "Carburant"
      ]
    };
  },
  mounted() {
    fetch("/items.json")
      .then((response) => response.json())
      .then((data) => {
        this.items = data;
      })
      .catch((error) => console.error("Error fetching data:", error));
  },
  computed: {
filteredItems() {
  let filtered = this.items;

  // Filter by categories
  if (this.selectedCategories.length > 0) {
    filtered = filtered.filter(item => this.selectedCategories.includes(item.categorie));
  }

  // Filter by search text
  if (this.search) {
    filtered = filtered.filter(item => 
      item.nom.toLowerCase().includes(this.search.toLowerCase()) ||
      item.categorie.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  // Filter by Disponibility
  if (this.Disponibility) {
    filtered = filtered.filter(item => item.Disponible === true);
  }

  // Sort the items based on selected sort order
  if (this.sortOrder === 1) {
    filtered.sort((a, b) => a.prix - b.prix); // Ascending
  } else if (this.sortOrder === 2) {
    filtered.sort((a, b) => b.prix - a.prix); // Descending
  }

  return filtered;
}

  },
  methods: {
    AddItem(item) {
      // Add item to the cart
      this.cart.push(item);
      this.total += item.prix; // Add the price to the total
    },
    RemoveFromCart(item) {
      // Remove item from the cart
      const index = this.cart.indexOf(item);
      if (index !== -1) {
        this.cart.splice(index, 1);
        this.total -= item.prix; // Subtract the price from the total
      }
    }
  }
});
</script>
